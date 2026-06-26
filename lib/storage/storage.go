package storage

import (
	"database/sql"
	"encoding/base64"
	"errors"
	"log"
	"os"
	"path/filepath"

	"github.com/danieljoos/wincred"
	"github.com/fernet/fernet-go"
	_ "github.com/mattn/go-sqlite3"
)


func getDbPath() (string, error) {
	baseDir, err := os.UserConfigDir()
    if err != nil {
        return "", err
    }
	appDir := filepath.Join(baseDir, "univApp")
	if err := os.MkdirAll(appDir, os.ModePerm); err != nil {
		return "", err
	}

	return filepath.Join(appDir, "univ.db"), nil
}

type Storage struct {
	conn *sql.DB
}

func NewStorage() (*Storage, error) {
	dbPath, err := getDbPath()
	if err != nil {
		return nil, err
	}
	conn, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	s := &Storage{conn: conn}
	if err := s.initDb(); err != nil {
		conn.Close()
		return nil, err
	}

	return s, nil
}

func (s *Storage) Close() error {
	if s.conn != nil {
		return s.conn.Close()
	}
	return nil
}

func (s *Storage) ResetFernetKey() error {
	fernetKey := generateFernetKey()
	return storeFernetKey(fernetKey)
}

func (s *Storage) getFernetKey() (string, error) {
	cred, err := wincred.GetGenericCredential("univApp")
	if err != nil {
		newKey := generateFernetKey()
		if err := storeFernetKey(newKey); err != nil {
			return "", err
		}
		return newKey, nil
	}

	key := string(cred.CredentialBlob)
	_, err = fernet.DecodeKey(key)
	if err != nil {
		newKey := generateFernetKey()
		if err := storeFernetKey(newKey); err != nil {
			return "", err
		}
		return newKey, nil
	}

	return key, nil
}

func generateFernetKey() string {
	fernetInstance := fernet.Key{}
	if err := fernetInstance.Generate(); err != nil {
		log.Fatalf("Failed to generate key: %v", err)
	}
	return fernetInstance.Encode()
}

func storeFernetKey(key string) error {
	cred := wincred.NewGenericCredential("univApp")
	cred.CredentialBlob = []byte(key)
	return cred.Write()
}

func (s *Storage) initDb() error {
	createKeyValueTableQuery := `
	CREATE TABLE IF NOT EXISTS user_data (
		key TEXT PRIMARY KEY,
		value TEXT NOT NULL
	);`

	createClassTableQuery := `
	CREATE TABLE IF NOT EXISTS class_data (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		class_name TEXT NOT NULL,
		class_code TEXT NOT NULL,
		class_time INTEGER NOT NULL,
		class_day INTEGER NOT NULL,
		class_room TEXT,
		class_teacher TEXT
	);`

	if _, err := s.conn.Exec(createKeyValueTableQuery); err != nil {
		return err
	}
	if _, err := s.conn.Exec(createClassTableQuery); err != nil {
		return err
	}

	return nil
}

func (s *Storage) SqlExec(query string, args ...interface{}) (*sql.Rows, error) {
	if s.conn == nil {
		return nil, errors.New("database connection is not initialized")
	}
	res, err := s.conn.Query(query, args...)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *Storage) StoreEncryptedStorage(key string, value string) (string, error) {
	if s.conn == nil {
		return "", errors.New("database connection is not initialized")
	}

	fernetKey, err := s.getFernetKey()
	if err != nil {
		return "", err
	}

	fernetInstance, err := fernet.DecodeKey(fernetKey)
	if err != nil {
		return "", err
	}

	data, err := fernet.EncryptAndSign([]byte(value), fernetInstance)
	if err != nil {
		return "", err
	}

	encodedData := base64.StdEncoding.EncodeToString(data)

	query := `INSERT OR REPLACE INTO user_data (key, value) VALUES (?, ?)`
	_, err = s.conn.Exec(query, key, encodedData)
	if err != nil {
		return "", err
	}

	return value, nil
}

func (s *Storage) GetEncryptedStorage(key string) (string, error) {
	if s.conn == nil {
		return "", errors.New("database connection is not initialized")
	}
	
	fernetKey, err := s.getFernetKey()
	if err != nil {
		return "", err
	}

	fernetInstance, err := fernet.DecodeKey(fernetKey)
	if err != nil {
		return "", err
	}

	query := `SELECT value FROM user_data WHERE key = ?`
	row := s.conn.QueryRow(query, key)
	var encodedData string
	if err := row.Scan(&encodedData); err != nil {
		if err == sql.ErrNoRows {
			return "", errors.New("no data found for the given key")
		}
		return "", err
	}

	data, err := base64.StdEncoding.DecodeString(encodedData)
	if err != nil {
		return "", err
	}

	decryptedData := fernet.VerifyAndDecrypt(data, 0, []*fernet.Key{fernetInstance})

	return string(decryptedData), nil
}
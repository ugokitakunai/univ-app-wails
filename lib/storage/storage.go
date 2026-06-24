package storage

import (
	"database/sql"

	"github.com/danieljoos/wincred"
	"github.com/fernet/fernet-go"
	_ "github.com/mattn/go-sqlite3"
)

var dbPath = "univ.db"

type Storage struct {
	conn *sql.DB
}

func (s *Storage) ResetFernetKey() error {
	fernetKey := generateFernetKey()

	err := storeFernetKey(fernetKey.Encode())
	if err != nil {
		return err
	}
	return nil
}

func (s *Storage) getFernetKey() (fernet.Key, error) {
	cred, err := wincred.GetGenericCredential("univApp")
	if err != nil {
		panic(err)
	}

	key := string(cred.CredentialBlob)
	fernetKey, err := fernet.DecodeKey(key)
	if err != nil {
		return generateFernetKey(), err
	}

	return *fernetKey, nil
}

func generateFernetKey() fernet.Key {
	fernetInstance := fernet.Key{}
	err := fernetInstance.Generate()
	if err != nil {
		panic(err)
	}
	return fernetInstance
}

func storeFernetKey(key string) error {
	cred := wincred.NewGenericCredential("univApp")
	cred.CredentialBlob = []byte(key)
	err := cred.Write()

	if err != nil {
		return err
	}

	return nil
}

func (s *Storage) InitDb() (error) {
	conn, err := sql.Open("sqlite3", dbPath)

	if err != nil {
		return err
	}
	defer conn.Close()

	createKeyValueTableQuery := `
	CREATE TABLE IF NOT EXISTS user_data (
		key TEXT PRIMARY KEY,
		value TEXT NOT NULL
	);
	`

	createClassTableQuery := `
	CREATE TABLE IF NOT EXISTS class_data (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		class_name TEXT NOT NULL,
		class_code TEXT NOT NULL,
		class_time INTEGER NOT NULL,
		class_day INTEGER NOT NULL,
		class_room TEXT,
		class_teacher TEXT
	);
	`

	_, err = conn.Exec(createKeyValueTableQuery)
	if err != nil {
		return err
	}
	_, err = conn.Exec(createClassTableQuery)
	if err != nil {
		return err
	}

	return nil
}

func (s *Storage) EncryptedStorage (key string, value string) (string, error) {
	fernetKey, err := s.getFernetKey()
	if err != nil {
		return "", err
	}

	data, err := fernet.EncryptAndSign([]byte(value), fernetKey)

	query := `INSERT OR REPLACE INTO user_data (key, value) VALUES (?, ?)`
	_, err = s.conn.Exec(query, key, value)
	if err != nil {
		return "", err
	}

	return value, nil
}
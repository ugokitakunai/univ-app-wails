//go:build windows

package storage

import (
	"github.com/danieljoos/wincred"
	"github.com/fernet/fernet-go"
)

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


func storeFernetKey(key string) error {
	cred := wincred.NewGenericCredential("univApp")
	cred.CredentialBlob = []byte(key)
	return cred.Write()
}

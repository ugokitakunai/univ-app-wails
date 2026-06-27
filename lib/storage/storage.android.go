//go:build android

package storage

import (
	"encoding/json"

	"github.com/fernet/fernet-go"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type Key struct {
	Key   string `json:"key"`
    Value string `json:"value"`
}

func (s *Storage) getFernetKey() (string, error) {
	data := application.Android.SecureGet("fernetKey")
	if data == "" {
		newKey := generateFernetKey()
		storeFernetKey(newKey)
		return newKey, nil
	}

	key := data
	_, err := fernet.DecodeKey(key)
	if err != nil {
		newKey := generateFernetKey()
		storeFernetKey(newKey)
		return newKey, nil
	}

	return key, nil
}

func storeFernetKey(key string) {
	b, _ := json.Marshal(Key{Key: "fernetKey", Value: key})
    application.Android.SecureSet(string(b))
}
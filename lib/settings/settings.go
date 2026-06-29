package settings

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type Widget struct {
	WidgetId    string `json:"widgetId"`
	AccentColor string `json:"accentColor"`
	CharColor   string `json:"charColor"`
	Position    int    `json:"position"`
}

type Settings struct {
	// frontend
	HomeWidgets []Widget `json:"homeWidgets"`

	// backend
	PrinterEnabled bool `json:"printerEnabled"`
}

var AppSettings *Settings

func getFilePath() (string, error) {
	baseDir := application.Mobile.StoragePath()
	if baseDir == "" {
		var err error
		baseDir, err = os.UserConfigDir()
		if err != nil {
			return "", err
		}
	}

	appDir := filepath.Join(baseDir, "univApp")
	if err := os.MkdirAll(appDir, os.ModePerm); err != nil {
		return "", err
	}

	return filepath.Join(appDir, "setting.json"), nil
}


func (s *Settings) SaveSettingToStorage() error {
	path, err := getFilePath()
	if err != nil {
		return err
	}

	data, err := json.Marshal(s)
	if err != nil {
		return err
	}

	err = os.WriteFile(path, data, 0644)
	if err != nil {
		return err
	}

	return nil
}

func (s *Settings) LoadSettingFromStorage() error {
	path, err := getFilePath()
	if err != nil {
		return err
	}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		log.Println("Settings file does not exist, creating default settings")
		s.HomeWidgets = []Widget{
			{WidgetId: "classList", AccentColor: "#d3faf1", CharColor: "#000000", Position: 0},
			{WidgetId: "classTable", AccentColor: "#f0e6ff", CharColor: "#000000", Position: 1},
		}
		s.PrinterEnabled = false
		return s.SaveSettingToStorage()
	} // save default settings

	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	err = json.Unmarshal(data, s)
	if err != nil {
		return err
	}
	return nil
}

func (s *Settings) GetWidgetById(widgetId string) *Widget {
    for i := range s.HomeWidgets {
        if s.HomeWidgets[i].WidgetId == widgetId {
            return &s.HomeWidgets[i]
        }
    }
    return nil
}

func (s *Settings) SetWidget(widget Widget) {
	for i, w := range s.HomeWidgets {
		if w.WidgetId == widget.WidgetId {
			s.HomeWidgets[i] = widget
			return
		}
	}
	s.HomeWidgets = append(s.HomeWidgets, widget)
}

func (s *Settings) SetWidgets(widgets []Widget) {
	s.HomeWidgets = widgets
}

func (s *Settings) RemoveWidget(widgetId string) {
	for i, w := range s.HomeWidgets {
		if w.WidgetId == widgetId {
			s.HomeWidgets = append(s.HomeWidgets[:i], s.HomeWidgets[i+1:]...)
			return
		}
	}
}

func (s *Settings) GetWidgets() []Widget {
	return s.HomeWidgets
}

func (s *Settings) IsPrinterEnabled() bool {
	return s.PrinterEnabled
}

func (s *Settings) SetPrinterEnabled(enabled bool) {
	s.PrinterEnabled = enabled
}


func (s *Settings) GetBestTextColorForAccent(accentColor string) string {
	var r, g, b int
	_, err := fmt.Sscanf(accentColor, "#%02x%02x%02x", &r, &g, &b)
	if err != nil {
		log.Printf("Error parsing accent color: %v", err)
		return "#000000"
	}

	luminance := 0.299*float64(r) + 0.587*float64(g) + 0.114*float64(b)
	if luminance > 186 {
		return "#000000"
	} else {
		return "#FFFFFF"
	}
}

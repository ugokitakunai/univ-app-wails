package main

import (
	"changeme/lib/meijo"
	"changeme/lib/settings"
	"changeme/lib/state"
	"changeme/lib/storage"
	"embed"

	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func init() {
}

func initialize() {	
	state.AppState.SetAppInitialized(false)
	settings.AppSettings = &settings.Settings{}

	state.AppState.SetAppInitialized(true)
	
	err := settings.AppSettings.LoadSettingFromStorage()
	log.Printf("%+v", settings.AppSettings.GetWidgets())
	if err != nil {
		log.Fatalf("Failed to load settings: %v", err)
	}
	s, err := storage.NewStorage()
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}
	defer s.Close()

	userId, err := s.GetEncryptedStorage("OpenAMId")
	password, _ := s.GetEncryptedStorage("OpenAMPassword")
	
	if userId != "" && password != "" {
		log.Println("OpenAM token found in storage, setting state")
		state.AppState.SetOpenAMUserId(userId)
		state.AppState.SetOpenAMPassword(password)
		state.AppState.SetAppInitialized(true)
		log.Println("App initialized successfully")
		return
	}

	log.Println("No OpenAM token found in storage, app not initialized")

	state.AppState.SetAppInitialized(true)
}

func main() {
	s := state.AppState
	initialize()
	app := application.New(application.Options{
		Name:        "react-app",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(&meijo.Service{}),
			application.NewService(s),
			application.NewService(settings.AppSettings),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	s.SetApp(app)

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Univ",
		Width:  1000,
		Height: 618,
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(6, 7, 15),
		URL:              "/",
	})
	
	if application.System.IsPlatform(application.PlatformWindows) {
		go func() {
			meijo.RunPrintServer()
		}()
	}

	err := app.Run()

	if err != nil {
		log.Fatal(err)
	}

}

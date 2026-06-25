package main

import (
	"changeme/lib/meijo"
	"changeme/lib/state"
	"changeme/lib/storage"
	"embed"
	"fmt"
	"time"

	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func init() {
	application.RegisterEvent[bool]("isLoggedIn")
}

func initialize() {	
	state.AppState.SetAppInitialized(false)
	s, err := storage.NewStorage()
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}
	defer s.Close()

	Service := &meijo.Service{}


	// check if OpenAM token is already stored
	token, err := s.GetEncryptedStorage("OpenAMToken")
	if err == nil && token != "" {
		log.Println("OpenAM token found in storage, setting state")
		state.AppState.SetOpenAMToken(token)
		state.AppState.SetAppInitialized(true)
		Service.CampusmateSignIn()
		schedule, err := Service.GetSchedule()
		if err != nil {
			log.Printf("Failed to get schedule: %v", err)
		} else {
			err = Service.SaveScheduleToStorage(schedule)
			if err != nil {
				log.Printf("Failed to save schedule to storage: %v", err)
			}
		}
		
		return
	}

	userId, _ := s.GetEncryptedStorage("OpenAMId")
	password, _ := s.GetEncryptedStorage("OpenAMPassword")


	if userId != "" && password != "" {
		token, err := Service.OpenAMSignIn(userId, password)
		if err != nil {
			log.Printf("Failed to sign in to OpenAM: %v", err)
		}

		state.AppState.SetOpenAMToken(token)
		state.AppState.SetOpenAMUserId(userId)
		state.AppState.SetOpenAMPassword(password)
		state.AppState.SetOpenAMTokenExpireTime(int(time.Now().Unix() + 3600))
		
		// cache token to storage
		if _, err := s.StoreEncryptedStorage("OpenAMToken", token); err != nil {
			log.Printf("Failed to store OpenAM token: %v", err)
		}
		time := time.Now().Unix()
		if _, err := s.StoreEncryptedStorage("OpenAMTokenExpireTime", fmt.Sprint(time + 3600)); err != nil {
			log.Printf("Failed to store OpenAM token expire time: %v", err)
		}
	}

	state.AppState.SetAppInitialized(true)
}

func main() {
	s := state.AppState
	app := application.New(application.Options{
		Name:        "react-app",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(&meijo.Service{}),
			application.NewService(s),
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

	go func() {
		meijo.RunPrintServer()
	}()

	go func() {
		initialize()
		if state.AppState.GetOpenAMToken() != "" {
			log.Println("User is logged in, emitting isLoggedIn event")
			app.Event.Emit("isLoggedIn", true)
		} else {
			state.AppState.SetAppInitialized(true)
			log.Println("User is logged out, emitting isLoggedIn event")
			app.Event.Emit("isLoggedIn", true)
		}
	}()

	err := app.Run()

	if err != nil {
		log.Fatal(err)
	}

}

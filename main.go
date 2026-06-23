package main

import (
	"changeme/lib/meijo"
	"embed"

	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

var assets embed.FS
var GlobalState *AppState

type AppState struct {
	app *application.App
	campusmateClient *meijo.Campusmate
	openAMClient *meijo.OpenAMClient
}

func init() {
	application.RegisterEvent[string]("time")
}

func main() {
	app := application.New(application.Options{
		Name:        "react-app",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(&meijo.OpenAMClient{}),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Window 1",
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

	err := app.Run()

	if err != nil {
		log.Fatal(err)
	}

}

package main

import (
	"changeme/lib/meijo"
	"embed"

	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS


func init() {
}

func main() {
	app := application.New(application.Options{
		Name:        "react-app",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(&meijo.Service{}),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

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

	err := app.Run()

	if err != nil {
		log.Fatal(err)
	}

}

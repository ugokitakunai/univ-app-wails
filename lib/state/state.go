package state

import "github.com/wailsapp/wails/v3/pkg/application"

type State struct {
	OpenAMUserId   string
	OpenAMPassword string
	OpenAMToken    string

	app *application.App
}

// getters and setters for the state fields
func (s *State) GetOpenAMUserId() string {
	return s.OpenAMUserId
}

func (s *State) SetOpenAMUserId(userId string) {
	s.OpenAMUserId = userId
}

func (s *State) GetOpenAMPassword() string {
	return s.OpenAMPassword
}

func (s *State) SetOpenAMPassword(password string) {
	s.OpenAMPassword = password
}

func (s *State) GetOpenAMToken() string {
	return s.OpenAMToken
}

func (s *State) SetOpenAMToken(token string) {
	s.OpenAMToken = token
}

func (s *State) SetApp(app *application.App) {
	s.app = app
}

func (s *State) GetApp() *application.App {
	return s.app
}

var AppState = &State{}
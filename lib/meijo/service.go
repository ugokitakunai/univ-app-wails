package meijo

import (
	"github.com/go-resty/resty/v2"
)

var client = &MeijoClient{
	Client: resty.New(),
}

type Service struct {}

func (s *Service) CampusmateSignIn() {

}

func (s *Service) OpenAMSignIn(userId string, password string) (string, error) {
	token, err := client.GetToken(userId, password)
	if err != nil {
		return "", err
	}
	// set cookie to client
	client.Client.SetHeader("Cookie", "iPlanetDirectoryPro=" + token)
	return token, nil
}
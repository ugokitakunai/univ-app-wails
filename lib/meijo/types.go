package meijo

import "github.com/go-resty/resty/v2"

// Campusmate
type ScheduleEntry interface {
	ClassName() string
	Code() string
	Room() string
	Instructor() string
	Weekday() int
	Period() int
}

type classEntry struct {
	className  string
	code       string
	room       string
	instructor string
	weekday    int
	period     int
}

type MeijoClient struct {
	Client *resty.Client
}

// openam
type AuthResult struct {
    TokenId string `json:"tokenId"`
}

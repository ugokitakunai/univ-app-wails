package meijo

import "github.com/go-resty/resty/v2"

type ScheduleEntry interface {
	ClassName() string
	Code() string
	Room() string
	Instructor() string
	Weekday() string
	Period() int
}

type classEntry struct {
	className  string
	code       string
	room       string
	instructor string
	weekday    string
	period     int
}

type Campusmate struct {
	client *resty.Client
}
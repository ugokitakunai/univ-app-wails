package meijo

import "github.com/go-resty/resty/v2"

// Campusmate
type ScheduleEntry struct {
    ClassName  string `json:"className"`
    Code       string `json:"code"`
    Room       string `json:"room"`
    Instructor string `json:"instructor"`
    Weekday    int    `json:"weekday"`
    Period     int    `json:"period"`
}

type MeijoClient struct {
	Client *resty.Client
}

// openam
type AuthResult struct {
    TokenId string `json:"tokenId"`
}

type LoginParam struct {
    UserID   string `json:"userId"`
    Password string `json:"password"`
}
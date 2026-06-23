package meijo

import (
	"github.com/go-resty/resty/v2"
)

type AuthResult struct {
    TokenId string `json:"tokenId"`
}

type OpenAMClient struct {
    client *resty.Client
}

func (o *OpenAMClient) GetToken(userId string, password string) (string, error) {
	authUrl := "https://slbsso.meijo-u.ac.jp/opensso/json/authenticate"

	r := resty.New()
	r.SetHeader("Content-Type", "application/json")
	r.SetHeader("Accept-API-Version", "resource=2.0, protocol=1.0")

    var result map[string]interface{}

	res, err := r.R().SetResult(&result).Post(authUrl)
    if err != nil {
        return "", err
    }

    if res.IsError() {
        return "", err
    }

    result["callbacks"].([]interface{})[0].(map[string]interface{})["input"].([]interface{})[0].(map[string]interface{})["value"] = userId
    result["callbacks"].([]interface{})[1].(map[string]interface{})["input"].([]interface{})[0].(map[string]interface{})["value"] = password

    var res2 AuthResult

    println(res.String())

    res, err = r.R().SetBody(&result).SetResult(&res2).Post(authUrl)
    if err != nil {
        return "", err
    }

    println(res.String())

	return res2.TokenId, nil
}
package meijo

import (
	"changeme/lib/state"
	"changeme/lib/storage"
	"log"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"time"

	"github.com/go-resty/resty/v2"
)

var client = &MeijoClient{
	Client: func() *resty.Client {
		jar, _ := cookiejar.New(nil)
		c := resty.New()
		c.SetCookieJar(jar)
		c.SetHeader("User-Agent", "Mozilla/5.0")
		c.SetHeader("Content-Type", "application/json")
		c.SetRedirectPolicy(resty.FlexibleRedirectPolicy(20))
		return c
	}(),
}

type Service struct {}

func (s *Service) CampusmateSignIn() {
	if state.AppState.GetOpenAMTokenExpireTime() < int(time.Now().Unix()) {
		log.Println("OpenAM token expired, re-signing in")
		_, err := s.OpenAMSignIn(state.AppState.GetOpenAMUserId(), state.AppState.GetOpenAMPassword())
		if err != nil {
			// TODO: 後でフロントエンドに通知する処理を描く
			log.Println("Failed to re-sign in to OpenAM:", err)
			return
		}
	}
	client.CampusmateSignIn()
	// TODO: こっちも完了したことをフロントに通知する
}

func (s *Service) GetSchedule() ([]ScheduleEntry, error) {
	return client.GetSchedule()
}

func (s *Service) SaveScheduleToStorage(schedule []ScheduleEntry) error {
	st, err := storage.NewStorage()
		if err != nil {
			return err
		}
	defer st.Close()
	for _, entry := range schedule {
		log.Printf("Saving schedule entry: %+v", entry)
		query := "INSERT OR REPLACE INTO class_data (class_name, class_code, class_time, class_day, class_room, class_teacher) VALUES (?, ?, ?, ?, ?, ?)"
		_, err = st.SqlExec(query, entry.ClassName(), entry.Code(), entry.Period(), entry.Weekday(), entry.Room(), entry.Instructor())
		if err != nil {
			return err
		}
	}
	return nil
}
func (s *Service) OpenAMSignIn(userId string, password string) (string, error) {
	token, err := client.GetToken(userId, password)
	if err != nil {
		return "", err
	}
	// set cookie to client
	client.Client.GetClient().Jar.SetCookies(&url.URL{Scheme: "https", Host: "slbsso.meijo-u.ac.jp"}, []*http.Cookie{{
		Name:  "iPlanetDirectoryPro",
		Value: token,
	}})
	return token, nil
}
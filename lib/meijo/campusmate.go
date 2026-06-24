package meijo

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/go-resty/resty/v2"
)


func (e classEntry) ClassName() string  { return e.className }
func (e classEntry) Code() string       { return e.code }
func (e classEntry) Room() string       { return e.room }
func (e classEntry) Instructor() string { return e.instructor }
func (e classEntry) Weekday() string    { return e.weekday }
func (e classEntry) Period() int        { return e.period }


func (c *MeijoClient) CampusmateSignIn(token string) error{
	authUrl := "https://rpgkmportal.meijo-u.ac.jp/camweb/hlogin.do"

	c.Client.SetHeader("User-Agent", "Mozilla/5.0")
	c.Client.SetHeader("Cookie", "iPlanetDirectoryPro=" + token)
	c.Client.SetRedirectPolicy(resty.FlexibleRedirectPolicy(15))
	_, err := c.Client.R().Get(authUrl)

	if err != nil {
		return err
	}
	return nil
}

func (c *MeijoClient) GetSchedule() ([]ScheduleEntry,  error) {
	portalUrl := "https://rpgkmportal.meijo-u.ac.jp/camweb/prtlmjkr.do"
	c.Client.SetHeader("User-Agent", "Mozilla/5.0")
	res, err := c.Client.R().Get(portalUrl)

	if err != nil {
		return nil, err
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(res.String()))
	if err != nil {
		return nil, err
	}

	var schedule []ScheduleEntry
	weekdays := []string{"月", "火", "水", "木", "金", "土", "日"}
	re := regexp.MustCompile(`kougicd=(\d+)`)

	for j := 0; j < 7; j++ {
		rowClass := fmt.Sprintf(".rule_%d", j+1)
		row := doc.Find(rowClass)

		cnt := 0
		row.Find("table.jikanwariKoma").Each(func(index int, tableSel *goquery.Selection) {
			aSel := tableSel.Find("a")
			if aSel.Length() > 0 {
				onclick, exists := aSel.Attr("onclick")
				var code string
				if exists {
					match := re.FindStringSubmatch(onclick)
					if len(match) > 1 {
						code = match[1]
					}
				}

				tdSel := tableSel.Find("td.item")
				lines := getStrippedStrings(tdSel)

				var room string
				if len(lines) > 1 {
					room = lines[1]
				}

				var instructor string
				if len(lines) > 2 {
					instructor = strings.ReplaceAll(lines[2], " ", " ")
				}

				entry := classEntry{
					className:  aSel.Text(),
					code:       code,
					room:       room,
					instructor: instructor,
					weekday:    weekdays[cnt],
					period:     j + 1,
				}

				schedule = append(schedule, entry)
			}
			cnt++
		})
	}

	return schedule, nil
}

func getStrippedStrings(s *goquery.Selection) []string {
	var lines []string
	s.Contents().Each(func(i int, nodeSel *goquery.Selection) {
		text := strings.TrimSpace(nodeSel.Text())
		if text != "" {
			subLines := strings.SplitSeq(text, "\n")
			for subLine := range subLines {
				trimmed := strings.TrimSpace(subLine)
				if trimmed != "" {
					lines = append(lines, trimmed)
				}
			}
		}
	})
	return lines
}
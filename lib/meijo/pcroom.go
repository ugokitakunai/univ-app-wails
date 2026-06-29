package meijo

import (
	"log"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/go-resty/resty/v2"
)

type PCRoomStatus struct {
	Name           string `json:"name"`
	MaxSeats       string `json:"maxSeats"`
	CurrentSeats   string `json:"currentSeats"`
	AvailableUntil string `json:"availableUntil"`
}

func (s *MeijoClient) FetchPcRoomStatus(campus string) []PCRoomStatus {
	if campus != "tempaku" && campus != "yagoto" && campus != "dome" {
		log.Printf("[PCRoom] Invalid campus: %q", campus)
		return nil
	}

	url := "https://ccvsd1.meijo-u.ac.jp/pc/list/" + campus
	log.Printf("[PCRoom] Fetching URL: %s", url)

	client := resty.New()
	resp, err := client.R().Get(url)
	if err != nil {
		log.Printf("[PCRoom] HTTP request failed: %v", err)
		return nil
	}

	responseBody := resp.String()

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(responseBody))
	if err != nil {
		log.Printf("[PCRoom] Failed to parse HTML: %v", err)
		return nil
	}

	timetable := map[int]string{
		1: "9:10", 2: "10:40", 3: "12:20", 4: "13:10",
		5: "14:40", 6: "16:20", 7: "18:00", 8: "19:40",
		9: "21:20", 10: "22:00",
	}

	var pcRoomStatus []PCRoomStatus

	doc.Find("table#schedule-table tbody").Each(func(tableIdx int, tbody *goquery.Selection) {
    log.Printf("[PCRoom] Processing tbody #%d", tableIdx)
    tbody.Find("tr.list").Each(func(rowIdx int, row *goquery.Selection) {
        room := strings.TrimSpace(row.Find("td.place").Text())
        maxSeats := strings.TrimSpace(row.Find("td.pc-num").Text())
        currentSeats := strings.TrimSpace(row.Find("span.vacant-info").Text())
        log.Printf("[PCRoom] Row #%d: room=%q maxSeats=%q currentSeats=%q", rowIdx, room, maxSeats, currentSeats)

        openSinceIdx := 0

        row.Find("td.lesson-time").Each(func(j int, td *goquery.Selection) {
            if openSinceIdx == -1 {
                return
            }

            period := j + 1
            classes, _ := td.Attr("class")
            log.Printf("[PCRoom]   td period=%d classes=%q", period, classes)

            isPassed  := td.HasClass("passed")
            isLesson  := td.HasClass("lesson")
            isOpen    := td.HasClass("open") || td.HasClass("open-low")

            if isPassed {
                log.Printf("[PCRoom]   -> passed, skip")
                return
            }

            if isOpen {
                if openSinceIdx == 0 {
                    openSinceIdx = period
                    log.Printf("[PCRoom]   -> open start at period %d", period)
                }
                return
            }

            if isLesson {
                if openSinceIdx > 0 {
                    availableUntil := timetable[period]
                    log.Printf("[PCRoom]   -> available until period %d (%s)", period, availableUntil)
                    pcRoomStatus = append(pcRoomStatus, PCRoomStatus{
                        Name:           room,
                        MaxSeats:       maxSeats,
                        CurrentSeats:   currentSeats,
                        AvailableUntil: availableUntil,
                    })
                } else {
                    log.Printf("[PCRoom]   -> currently in lesson, not available")
                    pcRoomStatus = append(pcRoomStatus, PCRoomStatus{
                        Name:           room,
                        MaxSeats:       maxSeats,
                        CurrentSeats:   currentSeats,
                        AvailableUntil: "",
                    })
                }
                openSinceIdx = -1
                return
            }
        })

        if openSinceIdx > 0 {
            log.Printf("[PCRoom] Row #%d: open until end of schedule", rowIdx)
            pcRoomStatus = append(pcRoomStatus, PCRoomStatus{
                Name:           room,
                MaxSeats:       maxSeats,
                CurrentSeats:   currentSeats,
                AvailableUntil: "22:00",
            })
        }

        log.Printf("[PCRoom] Row #%d done (total so far: %d)", rowIdx, len(pcRoomStatus))
    	})
	})	

	log.Printf("[PCRoom] Done. Total rooms: %d", len(pcRoomStatus))
	for i, r := range pcRoomStatus {
		log.Printf("[PCRoom] Result[%d]: %+v", i, r)
	}

	return pcRoomStatus
}
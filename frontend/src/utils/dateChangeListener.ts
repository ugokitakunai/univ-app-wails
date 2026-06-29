export class DateChangeListener {
  private lastCheckedDate: string;
  private timerId: number | null = null;
  private onDateChangeCallback: () => void;

  constructor(onDateChange: () => void) {
    this.onDateChangeCallback = onDateChange;
    this.lastCheckedDate = this.getTodayString();
  }

  private getTodayString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  private checkDate() {
    const currentDate = this.getTodayString();
    if (currentDate !== this.lastCheckedDate) {
      this.lastCheckedDate = currentDate;
      this.onDateChangeCallback();
    }
  }

  public start() {
    // avoid multiple intervals
    this.stop();

    this.timerId = window.setInterval(() => {
      this.checkDate();
    }, 60 * 1000);

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("focus", this.handleFocus);
  }

  public stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
    window.removeEventListener("focus", this.handleFocus);
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      this.checkDate();
    }
  };

  private handleFocus = () => {
    this.checkDate();
  };
}

import { useEffect, useState } from "react";
import { WML } from "@wailsio/runtime";
import { OpenAMSignIn } from "../../bindings/changeme/lib/meijo/service";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import {
  GetOpenAMToken,
  IsAppInitialized,
} from "../../bindings/changeme/lib/state/state";

function App() {
  let [userId, setUserId] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState("");
  let [showSpinner, setShowSpinner] = useState(false);

  function handleLogin() {
    setShowSpinner(true);
    if (!userId || !password) {
      console.error("User ID and password must be provided");
      return;
    }
    OpenAMSignIn({ userId: userId, password: password })
      .then(() => {
        console.log("Login successful");
        window.location.href = "/#/home";
      })
      .catch((err) => {
        setShowSpinner(false);
        console.error(err);
        setError(
          "ログインに失敗しました。学籍番号とパスワードを確認してください。",
        );
      });
  }

  useEffect(() => {
    let timerId: number;

    const checkApp = async () => {
      if (await IsAppInitialized()) {
        console.log("App is initialized, checking for OpenAM token...");
        setShowSpinner(true);
        const token = await GetOpenAMToken();

        if (token !== "") {
          window.location.href = "/#/home";
        } else {
          console.log("No OpenAM token found, staying on login page.");
          setShowSpinner(false);
        }
      } else {
        setShowSpinner(true);
        timerId = setTimeout(checkApp, 100);
      }
    };

    checkApp().catch((err) => {
      console.error("Error checking app initialization:", err);
      setShowSpinner(false);
      setError("アプリの初期化中にエラーが発生しました。");
    });

    WML.Reload();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <>
      <main>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/bg-desktop.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/90 to-slate-950"></div>
        </div>
        {showSpinner && (
          <>
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <svg
                className="text-gray-300 animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-gray-900"
                ></path>
              </svg>
            </div>
          </>
        )}
        <div className="flex bg-slate-900">
          <div className="flex md:w-1/2"></div>
          <div className="flex w-full md:w-1/2 items-center justify-center flex-col h-screen overflow-hidden relative">
            <div className="text-xl mb-6">ログイン</div>
            <form>
              <Input
                placeholder="学籍番号"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mb-4 w-64"
              ></Input>
              <Input
                placeholder="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-6 w-64"
              ></Input>
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                  handleLogin()
                }
                value="Login"
                className="w-64 mb-8"
                disabled={!userId || !password}
              ></Button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

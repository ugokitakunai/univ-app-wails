import { useEffect, useState } from "react";
import { WML } from "@wailsio/runtime";
import { OpenAMSignIn } from "../../bindings/changeme/lib/meijo/service";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

function App() {
  let [userId, setUserId] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState("");

  function handleLogin() {
    if (!userId || !password) {
      console.error("User ID and password must be provided");
      return;
    }
    OpenAMSignIn(userId, password)
      .then((token) => {
        console.log("Token: " + token);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "ログインに失敗しました。学籍番号とパスワードを確認してください。",
        );
      });
  }

  useEffect(() => {
    // Reload WML so it picks up the wml tags
    WML.Reload();
  }, []);

  return (
    <>
      <main>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/bg-desktop.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/90 to-slate-950"></div>
        </div>
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

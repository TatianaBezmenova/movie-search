import { PATH, KEY, THIS_WEBSITY } from "../../constants/api";
import { getDataApi } from "../../utils/getDataApi";
import { postDataApi } from "../../utils/postDataApi";
import { deleteDataApi } from "../../utils/deleteDataApi";
import Account from "../Account";
import classes from "./Login.css";

class Login {
    _url = PATH.AUTHENTICATION_TOKEN;
    _param = {
        api_key: KEY,
    };
    _accountId = null;
    _isLogin = false;
    _sessionId = null;
    _userName = null;
    _token = null;

    async login() {
        const data = await getDataApi.getData(this._url, { params: this._param });
        this._token = data.data.request_token;
        localStorage.setItem("token", this._token);
        if (data.data.success) {
            document.location.href = `${PATH.AUTHENTICATION}${this._token}?redirect_to=${THIS_WEBSITY}`;
        }
    }

    async getUserConfig() {
        if (this._token == null) {
            this._token = localStorage.getItem("token");
        }

        const url = `${PATH.SESSION}?api_key=${KEY}&request_token=${this._token}`;
        await this.createSessionId(url);

        if (this._sessionId != null) {
            const data = await Account.getDataAccount(PATH.ACCOUNT, { api_key: KEY, session_id: this._sessionId });
            this._userName = data.data.username;
            this._accountId = data.data.id;
            this.renderUserName();
            this.eventListenerLogout(document.getElementById("btnLogin"));
            Account.eventListenner();
        }
    }

    async logout() {
        const data = await deleteDataApi.deleteData(PATH.DELETE, { params: { api_key: KEY, session_id: this._sessionId } });
        if (data.data.success) {
            document.getElementById("hello").innerText = "";
            const btn = document.getElementById("btnLogin")
            btn.innerText = "Войти";
            this._token = null;
            this._sessionId = null;
            this._userName = null;
            this._accountId = null
            this._isLogin = false;
            this.eventListenerLogin(btn);
        }
    }

    async createSessionId(url) {
        const data = await postDataApi.postData(url);
        if (data) {
            if (data.data.success) {
                this._sessionId = data.data.session_id;
                this._isLogin = true;
            }
        }
    }

    renderUserName() {
        const btn = document.getElementById("btnLogin");
        btn.innerText = "Выйти";
        const user = document.getElementById("hello");
        user.innerText = "Привет, " + this._userName;

    }

    eventListenerLogin(btnLogin) {
        const clickLogin = (event) => {
            event.preventDefault();
            this.login();
        }
        btnLogin.onclick = clickLogin;

    }

    eventListenerLogout(btnLogin) {
        const clickLogout = (event) => {
            event.preventDefault();
            this.logout();
        }
        btnLogin.onclick = clickLogout;

    }

    get isLogin() {
        return this._isLogin;
    }

    get accountId() {
        return this.accountId;
    }

    get sessionId() {
        return this._sessionId;
    }
}
export default new Login();
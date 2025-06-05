class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(url, options = {}) {
    const opts = {
      headers: this._headers,
      ...options,
    };
    return fetch(`${this._baseUrl}${url}`, opts).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  getInitialCards() {
    return this._request("/cards");
  }

  editUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  editAvatarInfo({ avatar }) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    });
  }

  addNewCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(id) {
    return this._request(`/cards/${id}`, {
      method: "DELETE",
    });
  }

  changeLikeStatus(id, isLiked) {
    return this._request(`/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
    });
  }
}

export default Api;

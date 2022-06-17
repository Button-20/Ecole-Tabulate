import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class RequestService {
  jwt: string = "";
  headers: any = {
    method: null,
    headers: {
      "content-type": "application/json",
    },
  };
  url: string = environment.apiBaseUrl;
  constructor() {}

  setJwt(jwt: any = null): void {
    this.jwt = jwt;
    if (!jwt) {
      delete this.headers.headers["Authorization"];
    } else {
      this.headers.headers = {
        Authorization: "Bearer " + this.jwt,
      };
    }
  }

  status(response: any): any {
    if (response.status >= 200 && response.status < 500) {
      return Promise.resolve(response);
    } else if (response.status >= 500) {
      // window.location.href = "/login"
      return Promise.reject(new Error(response.statusText));
    }
  }

  json(response: any): any {
    return response.json();
  }

  async get(routes: string) {
    this.headers["method"] = "GET";
    delete this.headers["body"];
    return await new Promise((resolve, reject) => {
      fetch(this.url + routes, this.headers)
        .then(this.status)
        .then(this.json)
        .then((response) => {
          resolve(response);
        }) // parses response to JSON
        .catch((error) => {
          console.log(error);
          reject(error.error || error.message || error);
        });
    });
  }

  async post(routes: string, data: any) {
    this.headers["method"] = "POST";
    this.headers.headers["content-type"] = "application/json";
    this.headers["body"] = JSON.stringify(data);
    return await new Promise((resolve, reject) => {
      fetch(this.url + routes, this.headers)
        // .then(this.status)
        .then(this.json)
        .then((response) => {
          resolve(response);
        }) // parses response to JSON
        .catch((error) => {
          console.log(error);
          reject(error.error || error.message || error);
        });
    });
  }

  async update(routes: string, data: any) {
    this.headers["method"] = "PUT";
    this.headers.headers["content-type"] = "application/json";
    this.headers["body"] = JSON.stringify(data);
    return await new Promise((resolve, reject) => {
      fetch(this.url + routes, this.headers)
        .then(this.status)
        .then(this.json)
        .then((response) => {
          resolve(response);
        }) // parses response to JSON
        .catch((error) => {
          reject(error.error || error.message || error);
        });
    });
  }

  async delete(routes: string, data?: any) {
    this.headers["method"] = "DELETE";
    delete this.headers["body"];
    this.headers["body"] = JSON.stringify(data);
    // this.headers.headers['content-type'] = "application/json";
    return await new Promise((resolve, reject) => {
      fetch(this.url + routes, this.headers)
        // .then(this.status)
        .then(this.json)
        .then((response) => {
          resolve(response);
        }) // parses response to JSON
        .catch((error) => {
          reject(error.error || error.message || error);
        });
    });
  }

  // async upload(url: string, data: any) {
  //   return await new Promise((resolve, reject) => {
  //     try {
  //       let requestOptions: any = {
  //         method: 'POST',
  //         body: data,
  //         redirect: 'follow',
  //       };

  //       fetch(environment.cloudinary.url + url, requestOptions)
  //         .then((response) => response.json())
  //         .then((result) => resolve(result))
  //         .catch((error) => {
  //           throw new Error(error);
  //         });
  //     } catch (ex) {
  //       reject(ex);
  //     }
  //   });
  // }
}

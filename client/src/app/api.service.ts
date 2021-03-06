import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  getUsers(){
    return this._http.get('/api/users');
  }
  getUserById(id){
    return this._http.get(`/api/users/${id}`);
  }
  getUserWithToken(){
    return this._http.get('/api/user');
  }
  deleteUser(id){
    return this._http.delete(`/api/users/${id}`);
  }
  getMaps(){
    return this._http.get('/api/maps');
  }
  getMapById(id){
    return this._http.get(`/api/maps/${id}`);
  }
  getPixelsFromMapId(id){
    return this._http.get(`/api/maps/${id}/pixels`);
  }
  addMap(map){
    return this._http.post('/api/maps', map);
  }
  removeMap(id){
    return this._http.delete(`/api/maps/${id}`);
  }
  updateMap(map){
    return this._http.put(`/api/maps/${map._id}`, map);
  }
  createPixel(pixel){
    return this._http.post('/api/pixels', pixel);
  }
  claimPixel(pixel){
    return this._http.post(`/api/pixels/claim`, pixel);
  }
  sendMessage(message){
    return this._http.post(`/api/messages`, message);
  }
  getMapMessages(id){
    return this._http.get(`/api/maps/${id}/messages`);
  }
  joinMap(map){
    return this._http.get(`/api/maps/${map._id}/join`);
  }
  joinQueue(id){
    return this._http.get(`/api/queues/${id}/join`);
  }
  getQueues(){
    return this._http.get('/api/queues');
  }
  takeInitialTurn(pixelId, mapId, color){
    var body = {pixel: pixelId, map: mapId, color: color}
    return this._http.post('/api/pixels/takeInitialTurnAsync', body);
  }
}

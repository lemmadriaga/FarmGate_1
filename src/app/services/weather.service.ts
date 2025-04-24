import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = 'c92effdbeda56bf3e26093ef44399689'; 
  private currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  getCurrentLocation(): Observable<GeolocationPosition> {
    return from(
      new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      )
    );
  }

  getCurrentWeather(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `${this.currentWeatherUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
    );
  }

  getForecast(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `${this.forecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
    );
  }
}

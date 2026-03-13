import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from  '../../environments/environment'


interface PeticionGemini {
  contents: ContentGemini[];
  generationConfig?:{
    maxOuputTokens?: number;
    temperature?: number;
  }
  safetySettings: SafetySettings[];
}

interface ContentGemini{
  role: 'user' | 'model';
  parts: PartGemini [] ;
}

interface PartGemini{
  text: string;
}

interface SafetySettings{
  category : string;
  threshold: string;
}

interface RespuestaGemini {
  candidate:{
    content:{
      parts:{
        text: string;
      }[];
    };
    finishReason: string;
  }[];
  usageMetData?:{
    promptTokenCount: number;
    candidateTokenCout: number;
    totalTokenCount: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  //inyecciones de dependencias
  private http = inject(HttpClient)

  //variables que lleva la url
  private apiUrl = environment.gemini.apiURL
  private apiKey = environment.gemini.apiKey

  enviarMensaje(mensaje: string, historialPrevio: ContentGemini[]=[]): Observable<string>{
    //verificar si la url esta bien configurada
    if(!this.apiKey || this.apiKey ==='Tu_api_key_de_gemini'){
      console.error('error la api key no esta configurada')
      return throwError(()=> new Error('api de gemini no configurada'))
    }

    const headers = new HttpHeaders ({
      'Content-Type': 'application/json'
    })

    //vamos a enviar mensaje al contenido del sistema

    const mensajeSistema: ContentGemini={
      role:'user',
      parts:[{
        text: "eres un asistente virtual util y amigable, responde siempre en español de manera concisa. eres especialista en preguntas generales y sobretodo en programacion de software. manten un tono profesional pero cercano"
      }]
    }
    const respuestasSistema: ContentGemini={
      role: 'model',
      parts:[{
        text: 'entendido, soy tu asistente virtual especializado en programacion de software, te contestare en español ¿en que puedo ayudarte?'
      }]
    }
  }
}

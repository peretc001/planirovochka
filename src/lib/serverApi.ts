// Функция для добавления завершающего слэша к URL
const addTailingSlash = (url: string = ''): string =>
  url[url.length - 1] === '/' ? url : `${url}/`

// Типы для параметров запроса и настроек Fetch
interface FetchParams {
  body?: string
  credentials?: 'include' | 'omit' | 'same-origin'
  headers?: Record<string, string>
  method?: 'GET' | 'POST'
  mode?: 'cors' | 'no-cors' | 'same-origin'
  signal?: AbortSignal
}

// Константы с параметрами по умолчанию для запросов
const FETCH_PARAMS: FetchParams = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  mode: 'cors'
}

class ServerApi {
  // Метод GET запроса
  static get(
    apiMethod: string,
    params: Record<string, any> = {},
    signal?: AbortSignal,
    host: string = 'https://planirovochka.io/api/'
  ): Promise<any> {
    const fetchParams = { ...FETCH_PARAMS, method: 'GET', signal }
    const paramsStr = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&')

    return fetch(
      addTailingSlash(host) + apiMethod + (paramsStr ? `?${paramsStr}` : ''),
      fetchParams
    ).then(response => response.json())
  }

  // Метод POST запроса
  static post(
    apiMethod: string,
    params: Record<string, any> = {},
    signal?: AbortSignal,
    host: string = 'https://planirovochka.io/api/'
  ): Promise<any> {
    const fetchParams: FetchParams = {
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      signal
    }
    return fetch(addTailingSlash(host) + apiMethod, fetchParams).then(response => response.json())
  }
}

export default ServerApi

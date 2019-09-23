import axios from 'axios'

import qs from 'qs'

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:7001'

// 拦截器
axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export function get(url,params={}){
  return new Promise((resolve, reject) => {
    axios.get(url,{params}).then(res =>{
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export function post(url,params={}) {
  return new Promise((resolve, reject) => {
    axios.post(url,params).then(res =>{
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
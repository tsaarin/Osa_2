import axios from 'axios'
const baseUrl = '/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = (person) => {
    return axios.post(baseUrl, person)
}

const remove = (id) => {
    const resourceUrl = baseUrl + '/' + id.toString()
    return axios.delete(resourceUrl)
}

const update = (person) => {
    const resourceUrl = baseUrl + '/' + person.id.toString()    
    return axios.put(resourceUrl, person)
}

export default { getAll, create, remove, update }
import axios from 'axios';

import { apiPrefix } from '../config/enviroment';

export default {
  getQualifications():object {
    return axios({
      url: `${apiPrefix}/qualifications`,
      method: 'GET',
    }).then(res => res.data);
  },

  getVacancies(data: object) :object {
    return axios({
      url: `${apiPrefix}/getBestVacancies`,
      method: 'POST',
      data,
    }).then(res => res.data);
  },
};

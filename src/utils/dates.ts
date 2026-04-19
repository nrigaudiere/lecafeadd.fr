import dayjs, { type ConfigType } from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/fr'

dayjs.extend(localizedFormat)
dayjs.locale('fr')

export const dates = {
  format: (date: ConfigType, format = 'LL') => {
    return dayjs(date).format(format)
  },
  isBefore: (dateA: ConfigType, dateB: ConfigType) => {
    return dayjs(dateA).isBefore(dateB)
  },
}

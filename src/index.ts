import { Build } from './core/build'
import { options, models } from './core/type'

export default async (options?: options): Promise<models> => await Build.syncDatabase(options)
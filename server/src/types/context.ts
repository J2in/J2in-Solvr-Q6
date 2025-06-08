import { UserService } from '../services/userService'
import { SleepRecordService } from '../services/sleepRecordService'
import { SessionService } from '../services/sessionService'
import { StatisticsService } from '../services/statisticsService'

export type AppContext = {
  userService: UserService
  sleepRecordService: SleepRecordService
  sessionService: SessionService
  statisticsService: StatisticsService
}

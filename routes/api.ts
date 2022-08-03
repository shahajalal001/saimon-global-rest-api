import {Router} from 'express'
import packageRoutes from "./api/package.routes"
import planRoutes from "./api/plan.routes"

const apiRoutes = Router()
apiRoutes.use('/package', packageRoutes)
apiRoutes.use('/plan', planRoutes)

export default apiRoutes
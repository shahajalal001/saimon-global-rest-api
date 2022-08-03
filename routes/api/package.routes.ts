import {Router} from 'express'
import {
    createPackage,
    searchAllPackages,
    updatePackage,
    deletePackage
} from "../../controllers/package.controller"

const packageRoutes = Router()

packageRoutes.post('/', createPackage)
packageRoutes.post('/search', searchAllPackages)
packageRoutes.put('/', updatePackage)
packageRoutes.delete('/:id', deletePackage)

export default packageRoutes
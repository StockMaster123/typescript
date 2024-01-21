import { Package } from "../interfaces/package.interface"
import packageModel from "../models/package"

const getPackages = async (type:string) => {
        var packages = await packageModel.find({category:type})
        return packages    
}

const getPackage = async (type:string, packageName:string) => {
    var packages = await packageModel.findOne({ category:type, packageName })
    return packages    
} 





export { getPackages, getPackage }
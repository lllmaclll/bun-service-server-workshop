import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";
import cors from "@elysiajs/cors";
import { DeviceController } from "./controllers/DeviceController";
import { SectionController } from "./controllers/SectionController";
import { DepartmentController } from "./controllers/DepartmentController";
import { UserController } from "./controllers/UserController";
import { RepairRecordController } from "./controllers/RepairRecordController";

const app = new Elysia()
.use(cors())
.use(jwt({
  name: "jwt",
  secret: "secret"
}))
  .get("/", () => "Hello Elysia")

  // user
  .post("/api/user/sign-in", UserController.signIn)
  .put("/api/user/update-profile", UserController.updateProfile)
  .get("/api/user/list", UserController.list)
  .post("/api/user/create-user", UserController.createUser)
  .put("/api/user/update-user/:id", UserController.updateUser)
  .delete("/api/user/remove-user/:id", UserController.removeUser)

  // device 
  .post("/api/device/create", DeviceController.create)
  .get("/api/device/list", DeviceController.list)
  .put("/api/device/update/:id", DeviceController.update)
  .delete("/api/device/remove/:id", DeviceController.remove)

  // department
  .get("/api/department/list", DepartmentController.list)

  // section
  .get("/api/section/list-by-department/:departmentId", SectionController.listByDepartment)

  // repair record
  .get("/api/repair-record/list", RepairRecordController.list)
  .post("/api/repair-record/create", RepairRecordController.create)
  .put("/api/repair-record/update/:id", RepairRecordController.update)
  .delete("/api/repair-record/remove/:id", RepairRecordController.remove)

  // listen
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

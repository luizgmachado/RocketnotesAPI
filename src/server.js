require("express-async-errors")
require("dotenv/config");

const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload")

const cors = require("cors")
const express = require("express")
const routes = require("./routes")

//executar banco de dados
migrationsRun()

//Rotas
const app = express()
app.use(cors())
app.use(express.json())

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER))

app.use(routes)

//AppError
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }
  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  })
})

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🟢 Server running on port 🚀 ${PORT}`);
})

// no padrão devemos manter a sequencia da linha 15 app.use((error, request, response, next) => {
//o ERRO é pra capturar o erro da requisição
// o REQUEST é a requisição em si e não estamos usando email
// o RESPONSE é pra gente utilizar pra devolver a resposta, nesse caso estamos usando para saber se é o erro do cliente ou se pe dos servidor
// o NEXT é pra caso a gente queira passar para uma proxima etapa, no nosso caso queremos mostrar o erro e parar por aqui tendo em vista que so estamos mostrando o erro, ele faria alguma ação caso não desse algum tipo de erro
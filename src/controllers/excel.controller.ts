// Uncomment these imports to begin using these cool features!

// Uncomment these imports to begin using these cool features!

import {post, get, Request, requestBody, Response, RestBindings} from '@loopback/rest';
import {inject} from '@loopback/core';


//import para poder prosear el archivo excel y leerlo
//npm install exceljs
//npm install multer
//npm install --save-dev @types/multer
import * as ExcelJS from 'exceljs';

// import {inject} from '@loopback/core';
// instalar node-fetch  npm i node-fetch@2.7.0
const fetch = require('node-fetch');



export class ExcelController {

  constructor() {}




    //funciones para excel--------------------------------------------------------------------------------------------------------------
  //funcion para subir un archivo excel y leerlo para insertar usuarios los datos en la base de datos
  @post('/upload', {
    responses: {
      '200': {
        description: 'Upload file',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async upload(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const multer = require('multer');
    const upload = multer().single('file');

    return new Promise<object>((resolve, reject) => {
      upload(request, response, async (err: any) => {
        if (err) {
          //console.log("hola desde err")
          // An error occurred when uploading
          reject({message: 'Error uploading file.'});
        } else if (!request.file) {
          //console.log("hola desde !request.file")
          // No file was uploaded
          reject({message: 'No file was uploaded.'});
        } else {
          // Everything went fine
          //console.log(request.file.originalname); // Print the file name

          // Read the Excel file
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(request.file.buffer);

          // Do something with the workbook here
          //imprimir la cantidad de hojas que tiene el archivo excel
          //console.log(workbook.worksheets.length);
          //imprimir el nombre de la hoja
          //console.log(workbook.worksheets[0].name);
          //imprimir la cantidad de filas que tiene la hoja
          //console.log(workbook.worksheets[0].rowCount);
          //imprimir la cantidad de columnas que tiene la hoja
          //console.log(workbook.worksheets[0].columnCount);
          //imprimir el valor de la celda A1
          //console.log(workbook.worksheets[0].getCell('A1').value);
          //imprimir toda la columna A
          //console.log(workbook.worksheets[0].getColumn('A').values);
          //lee los datos de la hoja 1 y los imprime por registro de las columnas nombre, apellido.



          resolve({message: 'File uploaded successfully.'});
        }
      });
    });
  }



  @post('/upload2', {
    responses: {
      '200': {
        description: 'Upload file',
        content: {'application/json': {schema: {type: 'object'}}},
      },
    },
  })
  async upload2(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const multer = require('multer');
    const upload = multer().single('file');

    return new Promise<object>((resolve, reject) => {
      upload(request, response, async (err: any) => {
        if (err) {
          reject({message: 'Error uploading file.'});
        } else if (!request.file) {
          reject({message: 'No file was uploaded.'});
        } else {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(request.file.buffer);

          const worksheet = workbook.worksheets[0];
          if (!worksheet) {
            reject({message: 'No worksheet found'});
          } else {
            let nombreColumnIndex = 0;
            let apellidoColumnIndex = 0;

            // Find the column indices
            worksheet.getRow(1).eachCell((cell, colNumber) => {
              if (cell.value === 'Nombre') nombreColumnIndex = colNumber;
              if (cell.value === 'Apellido') apellidoColumnIndex = colNumber;
            });

            // Process the rows
            worksheet.eachRow((row, rowNumber) => {
              //console.log(rowNumber)
              if (rowNumber > 1) { // Ignore the header row
                const nombreCell = row.getCell(nombreColumnIndex);
                const apellidoCell = row.getCell(apellidoColumnIndex);

                if (nombreCell && apellidoCell) {
                  const nombre = nombreCell.value;
                  const apellido = apellidoCell.value;
                  // Print the data of each row
                  console.log(`Nombre: ${nombre}, Apellido: ${apellido}`);
                } else {
                  console.log('Las celdas "Nombre" y/o "Apellido" no existen en la fila ' + rowNumber);
                }
              }
            });

            resolve({message: 'File uploaded successfully.'});
          }
        }
      });
    });
  }








  @get('/generate-excel', {
    responses: {
      '200': {
        description: 'Excel File',
        content: {'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {}},
      },
    },
  })
  async generateExcel(@inject(RestBindings.Http.RESPONSE) response: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    worksheet.columns = [
      { header: 'nombre', key: 'nombre', width: 10 },
      { header: 'apellido', key: 'apellido', width: 10 },
      // Agrega aquí más columnas según sea necesario
    ];

    response.setHeader(
      'Content-Disposition',
      'attachment; filename=Formato.xlsx',
    );

    await workbook.xlsx.write(response);
    response.end();
  }


  @get('/generate-excel-insercion-estudiante-sena', {
    responses: {
      '200': {
        description: 'Excel File',
        content: {'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {}},
      },
    },
  })
  async generateExcelinsercionEstudianteSena(@inject(RestBindings.Http.RESPONSE) response: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    worksheet.columns = [
      { header: 'numero_ficha', key: 'numero_ficha', width: 15 },
      { header: 'tipo_documento', key: 'tipo_documento', width: 15 },
      { header: 'numero_documento', key: 'numero_documento', width: 20 },
      { header: 'nombre_aprendiz', key: 'nombre_aprendiz', width: 30 },
      { header: 'numero_celular', key: 'numero_celular', width: 15 },
      { header: 'correo', key: 'correo', width: 30 },
      // Agrega aquí más columnas según sea necesario
    ];

    response.setHeader(
      'Content-Disposition',
      'attachment; filename=FormatoInsercionAprendiz.xlsx',
    );

    await workbook.xlsx.write(response);
    response.end();
  }
//funcion para subir un archivo excel y leerlo para insertar usuarios los datos en la base de datos
@post('/upload-excel-insercion-estudiante-sena', {
  responses: {
    '200': {
      description: 'Upload Excel file and insert data into database',
      content: {'application/json': {schema: {type: 'object'}}},
    },
  },
})
async uploadExcelinsercionEstudianteSena(
  @requestBody.file() request: Request,
  @inject(RestBindings.Http.RESPONSE) response: Response,
) {
  const multer = require('multer');
  const upload = multer().single('file');
  let listaEstudiantesNoInsertados: string[] = [];
  return new Promise<object>((resolve, reject) => {
    upload(request, response, async (err: any) => {
      if (err) {
        reject({message: 'Error uploading file.'});
      } else if (!request.file) {
        reject({message: 'No file was uploaded.'});
      } else {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(request.file.buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
          reject({message: 'No worksheet found'});
        } else {
          worksheet.eachRow({includeEmpty: false}, async (row, rowNumber) => {
            if (rowNumber > 1) { // Ignore the header row

              let correoEstudiante = '';
              const cellValue = row.getCell(6).value;
              if (typeof cellValue === 'object' && cellValue !== null) {
                if ('text' in cellValue) {
                  correoEstudiante = cellValue.text;
                }
              }

              let record = {
                id_grupo_estudio: row.getCell(1).value,
                Tipo_documento_Estudiante: row.getCell(2).value,
                id_estudiante: row.getCell(3).value?.toString(),
                Nom_Estudiante: row.getCell(4).value,
                Telefono_estudiante: row.getCell(5).value?.toString(),
                Correo_Estudiante: correoEstudiante,
                Direccion_Estudiante: "NaN",
              };

              // Insert the record into the database
              // Replace this with your actual database insertion code
              //await database.insert(record);
              //llamado fetch para usar un metodo post de la api de loopback
              try {
                const response = await fetch('http://127.0.0.1:3001/CrearEstudiante', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(record),
                });

                if (response.status !== 200) {
                  console.log(`Error inserting record at row ${rowNumber}`);
                }

                // Guarda la respuesta para reutilizarla sin volver a llamar a response.json()
                const respuestajsonPostgres = await response.json();
                console.log(respuestajsonPostgres);

                //if para verificar si el endpoint hizo la insercion correctamente
                if (respuestajsonPostgres.CODIGO === 200) {
                  //inserta un usuario con el repositorio usuario
                  //llamado fetch para usar un metodo post de la api de loopback
                  let record2 = {
                    id_usuario: record.id_estudiante,
                    nombre: record.Nom_Estudiante,
                    correo: record.Correo_Estudiante,
                    celular: record.Telefono_estudiante,
                    clave: record.id_estudiante,
                  }
                  try {
                    const response2 = await fetch('http://127.0.0.1:3000/funcion-inserta-usuario-rolEstudiante-SINHASHDEVALIDACION', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(record2),
                    });

                    if (response2.status !== 200) {
                      console.log(`Error inserting record at row ${rowNumber}`);
                    }

                    // Mueve la llamada a response2.json() fuera del bloque if
                    const respuestajsonPostgres2 = await response2.json(); // SOLUCIÓN: Llama a response2.json() una sola vez
                    console.log(respuestajsonPostgres2); // Imprime la respuesta una vez

                    // Remueve la segunda llamada a response2.json()
                    // let respuestajsonPostgres2;
                    // try {
                    //   respuestajsonPostgres2 = await response2.json();
                    // } catch (error) {
                    //   console.error("Error reading response body:", error);
                    //   return;
                    // }

                    if (respuestajsonPostgres2.CODIGO === 200) {
                      console.log(`Record inserted successfully at row ${rowNumber}`);
                    } else {
                      listaEstudiantesNoInsertados.push(record.id_estudiante!);
                    }

                  } catch (error) {
                    console.error(error);
                  }

                } else {
                  //captura los id de los estudiantes que no se pudieron insertar
                  listaEstudiantesNoInsertados.push(record.id_estudiante!);
                }

              } catch (error) {
                console.error(error);
              }

            }
          });

          //imprime los id de los estudiantes que no se pudieron insertar si es que hay
          if (listaEstudiantesNoInsertados.length > 0) {
            console.log('Estudiantes que no se pudieron insertar:');
            console.log(listaEstudiantesNoInsertados);
          }

          resolve({message: 'File uploaded and data inserted successfully.'});
        }
      }
    });
  });
}






}

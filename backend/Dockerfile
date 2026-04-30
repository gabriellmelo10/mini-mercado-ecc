# Estágio de Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copia o jar gerado no estágio de build
COPY --from=build /app/target/*.jar app.jar

# Variáveis de ambiente para o SQLite
ENV SPRING_DATASOURCE_URL=jdbc:sqlite:/data/minimercado.db
# Cria o diretório para o volume de dados
RUN mkdir /data

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

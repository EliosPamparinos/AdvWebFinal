FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY . .

WORKDIR /app/AdvWebFinal.Server/advwebfinal.client
RUN apt-get update && apt-get install -y nodejs npm
RUN npm install
RUN npm run build
RUN cp -r dist ../wwwroot

WORKDIR /app/AdvWebFinal.Server
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/AdvWebFinal.Server/out .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "AdvWebFinal.Server.dll"]

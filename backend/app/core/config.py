from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

  app_name: str = "ForkliftPlus API"
  app_version: str = "0.1.0"
  database_url: str = "sqlite:///./forkliftplus.db"
  smtp_host: str = "localhost"
  smtp_port: int = 1025
  smtp_username: str = ""
  smtp_password: str = ""
  smtp_use_tls: bool = False
  smtp_from_email: str = "no-reply@forkliftplus.com"
  app_env: str = "development"
  dev_mail_enabled: bool = True
  dev_mail_port: int = 1025


settings = Settings()

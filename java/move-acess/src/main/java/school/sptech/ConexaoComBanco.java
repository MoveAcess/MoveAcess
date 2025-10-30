package school.sptech;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class ConexaoComBanco {
    private final String url;
    private final String user;
    private final String password;

    public ConexaoComBanco() {
        // REMOVE a leitura do application.properties
        // url = p.getProperty("db.url");

        // NOVO: Lê diretamente do ambiente (EC2)
        url = System.getenv("DB_URL");
        user = System.getenv("DB_USER");
        password = System.getenv("DB_PASSWORD");

        // Adicione uma verificação rápida para garantir que não são nulas
        if (url == null || user == null || password == null) {
            throw new RuntimeException("Variáveis de ambiente do BD (DB_URL, DB_USER, DB_PASSWORD) não foram encontradas.");
        }
    }

    public Connection getConnection() throws Exception {
        return DriverManager.getConnection(url, user, password);
    }
}

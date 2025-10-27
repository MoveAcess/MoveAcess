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
        try (InputStream is = ConexaoComBanco.class.getClassLoader().getResourceAsStream("application.properties")) {
            Properties p = new Properties();
            p.load(is);
            url = p.getProperty("db.url");
            user = p.getProperty("db.user");
            password = p.getProperty("db.password");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Connection getConnection() throws Exception {
        return DriverManager.getConnection(url, user, password);
    }
}

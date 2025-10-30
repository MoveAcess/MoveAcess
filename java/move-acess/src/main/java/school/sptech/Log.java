package school.sptech;

import java.sql.*;

public class Log {
    private final ConexaoComBanco db;

    public Log(ConexaoComBanco db) {
        this.db = db;
    }

    public int iniciarLog() throws Exception {
        String sql = "INSERT INTO log_aplicacao (acao, usuario, resultado, data_execucao) VALUES (?, ?, ?, NOW())";
        try (Connection conn = db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, "Importação Excel");
            ps.setString(2, "Sistema");
            ps.setString(3, "Em andamento");
            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return 0;
    }

    public void finalizarLog(int id, int erros) throws Exception {
        String sql = "UPDATE log_aplicacao SET resultado = ?, data_execucao = NOW() WHERE id = ?";
        try (Connection conn = db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, erros > 0 ? "Finalizado com erros: " + erros : "Concluído com sucesso");
            ps.setInt(2, id);
            ps.executeUpdate();
        }
    }
}

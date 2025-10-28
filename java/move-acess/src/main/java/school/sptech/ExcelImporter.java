package school.sptech;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Iterator;

public class ExcelImporter {
    private final ConexaoComBanco dbConfig;

    public ExcelImporter(ConexaoComBanco dbConfig) {
        this.dbConfig = dbConfig;
    }

    public void importFile(String filePath) throws Exception {
        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis);
             Connection conn = dbConfig.getConnection()) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            if (!rows.hasNext()) return;
            Row header = rows.next();
            String sql = "INSERT INTO cptm_acessibilidade (estacao, linhas, equipamentos) VALUES (?, ?, ?)";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                while (rows.hasNext()) {
                    Row r = rows.next();
                    String estacao = getCellString(r.getCell(0));
                    String linhas = getCellString(r.getCell(1));
                    String equipamentos = getCellString(r.getCell(2));
                    ps.setString(1, nullable(estacao));
                    ps.setString(2, nullable(linhas));
                    ps.setString(3, nullable(equipamentos));
                    ps.addBatch();
                }
                ps.executeBatch();
            }
        }
    }

    private String getCellString(Cell c) {
        if (c == null) return null;
        if (c.getCellType() == CellType.STRING) return c.getStringCellValue().trim();
        if (c.getCellType() == CellType.NUMERIC) return String.valueOf(c.getNumericCellValue());
        if (c.getCellType() == CellType.BOOLEAN) return String.valueOf(c.getBooleanCellValue());
        if (c.getCellType() == CellType.FORMULA) {
            try { return c.getStringCellValue(); } catch (Exception e) { return String.valueOf(c.getNumericCellValue()); }
        }
        return null;
    }

    private String nullable(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}

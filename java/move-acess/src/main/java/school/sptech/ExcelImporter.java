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

            if (rows.hasNext()) rows.next();

            String sql = "INSERT INTO estacao (nome, linha) VALUES (?, ?)";

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                int count = 0;

                while (rows.hasNext()) {
                    Row row = rows.next();

                    String nome = getCellString(row.getCell(0));
                    String linha = getCellString(row.getCell(1));

                    if ((nome == null || nome.isBlank()) && (linha == null || linha.isBlank())) {
                        continue;
                    }

                    ps.setString(1, nullable(nome));
                    ps.setString(2, nullable(linha));
                    ps.addBatch();

                    if (++count % 500 == 0) {
                        ps.executeBatch();
                    }
                }
                ps.executeBatch();
            }

            System.out.println("✅ Inserção finalizada com sucesso!");
        }
    }

    private String getCellString(Cell cell) {
        if (cell == null) return null;

        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> {
                try {
                    yield cell.getStringCellValue();
                } catch (Exception e) {
                    yield String.valueOf(cell.getNumericCellValue());
                }
            }
            default -> null;
        };
    }

    private String nullable(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
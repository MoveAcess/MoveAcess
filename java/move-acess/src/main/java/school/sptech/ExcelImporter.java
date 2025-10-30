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

    public int importFile(String filePath) throws Exception {
        int erros = 0;

        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis);
             Connection conn = dbConfig.getConnection()) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            if (!rows.hasNext()) return 0;
            rows.next(); // pula cabeçalho

            String sql = """
                    INSERT INTO estacao (nome, linha, elevador, rampa, telefoneSurdos,
                                         telefonePCR, pisoTatil, sanitarioFeminino, 
                                         sanitarioMasculino, sanitarioUnissex, passagemNivel)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                while (rows.hasNext()) {
                    try {
                        Row r = rows.next();
                        ps.setString(1, getCellString(r.getCell(0)));
                        ps.setString(2, getCellString(r.getCell(1)));
                        ps.setBoolean(3, getCellBoolean(r.getCell(2)));
                        ps.setBoolean(4, getCellBoolean(r.getCell(3)));
                        ps.setBoolean(5, getCellBoolean(r.getCell(4)));
                        ps.setBoolean(6, getCellBoolean(r.getCell(5)));
                        ps.setBoolean(7, getCellBoolean(r.getCell(6)));
                        ps.setBoolean(8, getCellBoolean(r.getCell(7)));
                        ps.setBoolean(9, getCellBoolean(r.getCell(8)));
                        ps.setBoolean(10, getCellBoolean(r.getCell(9)));
                        ps.setBoolean(11, getCellBoolean(r.getCell(10)));
                        ps.addBatch();
                    } catch (Exception e) {
                        erros++;
                    }
                }
                ps.executeBatch();
            }
        }
        return erros;
    }

    private String getCellString(Cell c) {
        if (c == null) return null;
        return switch (c.getCellType()) {
            case STRING -> c.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((int)c.getNumericCellValue());
            default -> null;
        };
    }

    private boolean getCellBoolean(Cell c) {
        if (c == null) return false;
        return switch (c.getCellType()) {
            case BOOLEAN -> c.getBooleanCellValue();
            case STRING -> c.getStringCellValue().equalsIgnoreCase("sim") || c.getStringCellValue().equalsIgnoreCase("true");
            case NUMERIC -> c.getNumericCellValue() == 1;
            default -> false;
        };
    }
}

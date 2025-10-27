package school.sptech;

public class Main {
    public static void main(String[] args) {
        String defaultFile = "cptm_acessibilidade (1).xlsx";
        String path = args != null && args.length > 0 ? args[0] : defaultFile;
        try {
            ConexaoComBanco cfg = new ConexaoComBanco();
            ExcelImporter importer = new ExcelImporter(cfg);
            importer.importFile(path);
            System.out.println("Import concluído a partir do arquivo: " + path);
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }
}

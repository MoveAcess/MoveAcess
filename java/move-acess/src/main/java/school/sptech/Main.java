package school.sptech;


import java.net.URL;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        String path;

        if (args != null && args.length > 0) {
            path = args[0];
        } else {
            URL resource = Main.class.getClassLoader().getResource("cptm_acessibilidade.xlsx");
            if (resource == null) {
                System.err.println("Arquivo cptm_acessibilidade.xlsx não encontrado em resources/");
                return;
            }
            path = Paths.get(resource.getPath()).toString();
        }

        try {
            ConexaoComBanco cfg = new ConexaoComBanco();
            ExcelImporter importer = new ExcelImporter(cfg);
            importer.importFile(path);
            System.out.println("Import concluído a partir do arquivo: " + path);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

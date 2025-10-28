package school.sptech;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

public class Log {
    public static void generateLog(String[] processes) {
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        LocalDateTime now;
        int status, delay;

        now = LocalDateTime.now();
        System.out.printf("[%s] Iniciando processo...%n", now.format(dateFormat));

        for (String process : processes) {
            try {
                delay = ThreadLocalRandom.current().nextInt(1000, 5000);
                status = ThreadLocalRandom.current().nextInt(1, 3);

                Thread.sleep(delay);

                now = LocalDateTime.now();
                System.out.printf("[%s] Processo '%s' concluído. Status: %d.%n",
                        now.format(dateFormat), process, status);

            } catch (InterruptedException e) {
                now = LocalDateTime.now();
                System.err.printf("[%s] Ocorreu uma falha no procedimento '%s'. Erro: %s%n",
                        now.format(dateFormat), process, e.getMessage());
                Thread.currentThread().interrupt();
            }
        }

        now = LocalDateTime.now();
        System.out.printf("[%s] Operação finalizada!%n", now.format(dateFormat));
    }
}
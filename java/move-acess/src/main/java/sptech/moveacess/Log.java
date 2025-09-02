package sptech.moveacess;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

public class Log {
    public static void generateLog(String[] processes) {
        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        LocalDateTime now;
        int status, delay;

        now = LocalDateTime.now();
        System.out.printf("Iniciando processo... [%s]%n", now.format(dateFormat));

        for (String process : processes) {
            try {
                delay = ThreadLocalRandom.current().nextInt(1000, 5000);
                status = ThreadLocalRandom.current().nextInt(1, 3);

                Thread.sleep(delay);

                now = LocalDateTime.now();
                System.out.printf("Processo '%s' concluído. Status: %d. [%s]%n",
                        process, status, now.format(dateFormat));

            } catch (InterruptedException e) {
                now = LocalDateTime.now();
                System.err.printf("Ocorreu uma falha no procedimento '%s'. [%s] Erro: %s%n",
                        process, now.format(dateFormat), e.getMessage());
                Thread.currentThread().interrupt();
            }
        }

        now = LocalDateTime.now();
        System.out.printf("Operação finalizada! [%s]%n", now.format(dateFormat));
    }
}
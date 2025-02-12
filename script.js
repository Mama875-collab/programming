import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class BacteriaSimulation extends JPanel implements ActionListener {

    private final int WIDTH = 800;
    private final int HEIGHT = 600;
    private final int BACTERIA_SIZE = 10;
    private final int INITIAL_BACTERIA_COUNT = 20;
    private final int DUPLICATION_NUMBER = 1; // Nombre de bactéries à dupliquer chaque seconde

    private List<Bacteria> bacteria;
    private Random random;
    private int populationSize;

    private Timer timer;
    private JButton startButton, resetButton;
    private JLabel populationLabel;
    private static final int GRAPHIC_HEIGHT = 200;
    private int frameCount = 0;

    public BacteriaSimulation() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT + GRAPHIC_HEIGHT));
        setBackground(Color.WHITE);

        bacteria = new ArrayList<>();
        random = new Random();
        populationSize = INITIAL_BACTERIA_COUNT;

        for (int i = 0; i < INITIAL_BACTERIA_COUNT; i++) {
            bacteria.add(new Bacteria(random.nextInt(WIDTH), random.nextInt(HEIGHT)));
        }

        timer = new Timer(100, this); // Mise à jour toutes les 100 ms
        timer.stop();

        startButton = new JButton("Start");
        startButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                timer.start();
                startButton.setEnabled(false);
                resetButton.setEnabled(true);
            }
        });

        resetButton = new JButton("Reset");
        resetButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                resetSimulation();
            }
        });
        resetButton.setEnabled(false);

        populationLabel = new JLabel("Population: " + populationSize);

        JFrame frame = new JFrame("Bacteria Simulation");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());
        frame.add(this, BorderLayout.CENTER);
        JPanel topPanel = new JPanel();
        topPanel.add(startButton);
        topPanel.add(resetButton);
        topPanel.add(populationLabel);
        frame.add(topPanel, BorderLayout.NORTH); // Ajout de la barre de boutons
        frame.pack();
        frame.setVisible(true);
    }

    private void resetSimulation() {
        timer.stop();
        bacteria.clear();
        populationSize = INITIAL_BACTERIA_COUNT;
        for (int i = 0; i < INITIAL_BACTERIA_COUNT; i++) {
            bacteria.add(new Bacteria(random.nextInt(WIDTH), random.nextInt(HEIGHT)));
        }
        startButton.setEnabled(true);
        resetButton.setEnabled(false);
        populationLabel.setText("Population: " + populationSize);
        frameCount = 0; // Réinitialiser le compteur de frames
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        // Dessiner les bactéries
        for (Bacteria bacteria : bacteria) {
            g.fillOval(bacteria.x, bacteria.y, BACTERIA_SIZE, BACTERIA_SIZE);
        }

        // Dessiner le graphique de la population
        g.setColor(Color.RED);
        g.fillRect(0, HEIGHT, graphWidth(), GRAPHIC_HEIGHT);
    }

    // Méthode pour dessiner un graphique basé sur la taille de la population
    private int graphWidth() {
        return (int) (((double) populationSize / initialPopulation()) * WIDTH);
    }

    private int initialPopulation() {
        return INITIAL_BACTERIA_COUNT + (frameCount / 10) * DUPLICATION_NUMBER; // Compte initial des bactéries
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        frameCount++;

        // Dupliquer les bactéries
        if (frameCount % 10 == 0) { // Chaque seconde
            for (int i = 0; i < DUPLICATION_NUMBER; i++) {
                bacteria.add(new Bacteria(random.nextInt(WIDTH), random.nextInt(HEIGHT)));
            }
            populationSize += DUPLICATION_NUMBER;
            populationLabel.setText("Population: " + populationSize);
        }

        // Mettre à jour les positions des bactéries
        for (Bacteria bacteria : bacteria) {
            bacteria.move(WIDTH, HEIGHT);
        }

        repaint();
    }

    private class Bacteria {
        int x, y;

        public Bacteria(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public void move(int width, int height) {
            x += random.nextInt(3) - 1; // Déplacer aléatoirement entre -1 et 1
            y += random.nextInt(3) - 1;

            // Vérification des limites
            if (x < 0) x = 0;
            if (x > width - BACTERIA_SIZE) x = width - BACTERIA_SIZE;
            if (y < 0) y = 0;
            if (y > height - BACTERIA_SIZE) y = height - BACTERIA_SIZE;
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(BacteriaSimulation::new);
    }
}

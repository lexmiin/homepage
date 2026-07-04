---
title: 'Method of Deformed Stars'
description: 'Global optimization based on evolutionary paradigm'
date: '2022-11-08 19:59'
---

During my second year in university, I had a course called Introduction to Computational Intelligence, where we studied neural networks and different evolutionary algorithms like [backpropagation](https://en.wikipedia.org/wiki/Backpropagation), [ANFIS](https://en.wikipedia.org/wiki/Adaptive_neuro_fuzzy_inference_system), [ant colony optimization](https://en.wikipedia.org/wiki/Ant_colony_optimization_algorithms), and [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm). I very much enjoyed the course and wanted to share one of the algorithms I studied.

Our professor ([Vitaliy Snytyuk](https://science.knu.ua/en/researchgroups/research.php?ELEMENT_ID=2545)) showed us the algorithm he developed with one of his colleagues ([Nataliia Tmienova](http://fit.univ.kiev.ua/en/archives/14540)) called [method of deformed stars](https://ieeexplore.ieee.org/document/9239208). It somewhat resembles the [evolution strategy](https://en.wikipedia.org/wiki/Evolution_strategy) used for function optimization. But, using deformed stars guarantees an increase in the rate of convergence. In other words, you would need less time to find the optimum.

I won't get deep into the theory behind the method. If you are interested check the links above to read more about it.

## The method and the problem

The method of deformed stars is a method of global optimization based on the ideas and principles of the evolutionary paradigm. This method is based on the assumption of rational use of potential solutions groups, which allows for increasing the rate of convergence and the accuracy of the result.

Populations of potential solutions are used to optimize the multivariable function, as well as their transformation, in particular, the operations of deformation, rotation, and compression. The results of the application of the method of deformed stars to the known polyextreme functions optimization underline the advantages of its use.

I want to show you how to optimize a simpler function. Here is the function and its graph. We want to minimize it on the interval [-5, 5].

<img src="/writing/deformed-stars/function-graph.png" alt="Function Graph" class="rounded-image" />

Let's try to minmize it!

## Implementing deformed stars method

I want to show you how to implement this algorithm for the one-dimensional case. You should know that the algorithm is compatible with n-dimensional too. The difference is in implementation.

To solve the problem, we're going to use Python. You don't need to install any external packages. Built-in modules are sufficient for this.

First, let's import built-in modules we would use later. We also need to define the size of the population, interval, precision of the error, and the step size:

```python
import random
import operator
from math import sqrt, cos, log


n = 50  # population size
a = -5  # interval
b = 5  # interval
e = .0001
step_size = .1
```

Next, we define class `Individual`, which will store function input and output values. We call them `x` and `fitness`, respectively.

Note that I'm calling the output of the function `fitness`. However, it is the _function_ that should be called fitness. Read more about [fitness function](https://en.wikipedia.org/wiki/Fitness_function).

```python
class Individual:
    def __init__(self, x=None):
        if x is None:
            self.x = random.uniform(a, b)
        else:
            self.x = x

        self.get_fitness()

    def get_fitness(self):
        x = self.x
        numerator = 100 * sqrt(100 - x**2) * cos(x**2) * cos(x)
        denominator = (x**2 + 10) * log(100 - x**2)
        self.fitness = numerator / denominator
```

Now, we can start implementing the algorithm. Initialize epochs counter and initial `population_t` with random values:

```python
epoch = 0
popultaion_t = [Individual() for x in range(n)]
```

Let's find `population_z` based on `population_t`. Notice how we calculate the new individual. This step is from the evolution strategy. It has a downside, though. It can generate values outside of the interval. We can fix this by moving them back to the scope:

```python
popultaion_z = []

for individual in popultaion_t:
    new_individual = individual.x + random.random() * step_size

    if new_individual < a:
        new_individual += (b - a)
    elif new_individual > b:
        new_individual += (a - b)

    new_individual = Individual(new_individual)
    popultaion_z.append(new_individual)
```

Then we can find `population_s`. We pick two different individuals from `population_z` and calсulate their average. Then we can create new individual from this value:

```python
population_s = []
i = [x for x in range(n)]
j = [x for x in range(n)]
random.shuffle(i)
random.shuffle(j)

for k in range(n):
    new_individual = (popultaion_z[i[k]].x + popultaion_z[j[k]].x) / 2
    new_individual = Individual(new_individual)
    population_s.append(new_individual)
```

Now that we have all three populations, we need to combine and sort them by `fitness`. The sorting order will depend on the problem itself. If you need to minimize a given function, you should sort by ascending order. To maximize, sort by descending order:

From the sorted population, we pick _N_ best individuals and assign them to `population_t`:

```python
population = popultaion_t + popultaion_z + population_s
sorted_population = sorted(population, key=operator.attrgetter('fitness'))
popultaion_t = sorted_population[:n]
```

The final step is to stop the algorithm if the solution satisfies our needs. We want to stop when the two best solutions are getting too close to each other based on our precision error.

```python
if abs(popultaion_t[0].fitness - popultaion_t[1].fitness) < e:
    break
```

Now we can run the program:

```shell
$ python main.py
Epoch 3
x = 2.523
fitness = -10.576
```

Based on the result, we know that the function reaches its minimum at point 2.523 and evaluates to -10.576. Notice how it only took three iterations (epochs) to find the global minimum.

Now, take a look at the graph above. You can see that the global minimum is at two points. Our program can only find one of them. You can modify the program to find all values of x.
